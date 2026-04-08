"use client";

import AiChat from './_components/AiChat';
import DocumentList from './_components/DocumentList';
import Preview from './_components/Preview';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/Provider/api';
import type { DocviewDocument } from './_components/docview-types';

interface PropertySummary {
    id: number;
    property_name: string;
}

const getFileNameFromUrl = (url: string) => {
    const safeUrl = url.split('?')[0];
    return decodeURIComponent(safeUrl.substring(safeUrl.lastIndexOf('/') + 1));
};

const page = () => {
    const searchParams = useSearchParams();

    const [documents, setDocuments] = useState<DocviewDocument[]>([]);
    const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
    const [propertyId, setPropertyId] = useState<number | null>(null);
    const [propertyName, setPropertyName] = useState<string>('Selected Property');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const queryPropertyId = useMemo(() => {
        const raw = searchParams.get('propertyId') || searchParams.get('id');
        if (!raw) return null;
        const parsed = Number(raw);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    }, [searchParams]);

    useEffect(() => {
        const loadDocuments = async () => {
            setLoading(true);
            setError(null);

            try {
                let resolvedPropertyId = queryPropertyId;
                let resolvedPropertyName = 'Selected Property';

                if (!resolvedPropertyId) {
                    const propertyRes = await api.get('/api/properties/');
                    const properties: PropertySummary[] = propertyRes.data?.data || [];

                    if (properties.length === 0) {
                        setPropertyId(null);
                        setPropertyName('No Property Found');
                        setDocuments([]);
                        setSelectedDocumentId(null);
                        return;
                    }

                    resolvedPropertyId = properties[0].id;
                    resolvedPropertyName = properties[0].property_name || resolvedPropertyName;
                }

                setPropertyId(resolvedPropertyId);
                setPropertyName(resolvedPropertyName);

                const docsRes = await api.get(`/api/properties/${resolvedPropertyId}/documents/`);
                const fetchedDocs: DocviewDocument[] = docsRes.data?.data || [];
                setDocuments(fetchedDocs);

                setSelectedDocumentId((currentSelected) => {
                    if (currentSelected && fetchedDocs.some((doc) => doc.id === currentSelected)) {
                        return currentSelected;
                    }
                    return fetchedDocs[0]?.id ?? null;
                });
            } catch (loadError) {
                console.error('Failed to load docview documents', loadError);
                setError('Unable to load documents right now.');
                setDocuments([]);
                setSelectedDocumentId(null);
            } finally {
                setLoading(false);
            }
        };

        loadDocuments();
    }, [queryPropertyId]);

    const selectedDocument = useMemo(
        () => documents.find((doc) => doc.id === selectedDocumentId) ?? null,
        [documents, selectedDocumentId],
    );

    const handleDownloadDocument = (document: DocviewDocument) => {
        if (typeof window === 'undefined') return;

        const anchor = window.document.createElement('a');
        anchor.href = document.file_url;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.download = getFileNameFromUrl(document.file_url);
        window.document.body.appendChild(anchor);
        anchor.click();
        window.document.body.removeChild(anchor);
    };

    return (
        <div className='flex flex-col w-full gap-3 p-3 sm:p-4 min-h-screen'>
            <div className='flex flex-col lg:flex-row gap-3 flex-1'>
                <div className='w-full lg:flex-[1.4] min-h-0'>
                    <Preview
                        document={selectedDocument}
                        loading={loading}
                        propertyId={propertyId}
                        propertyName={propertyName}
                        onDownloadDocument={handleDownloadDocument}
                    />
                </div>
                <div className='w-full lg:flex-1 min-h-0'>
                    <AiChat />
                </div>
            </div>
            <div className='w-full'>
                <DocumentList
                    documents={documents}
                    selectedDocumentId={selectedDocumentId}
                    loading={loading}
                    error={error}
                    onSelectDocument={setSelectedDocumentId}
                    onDownloadDocument={handleDownloadDocument}
                />
            </div>
        </div>
    );
};

export default page;
