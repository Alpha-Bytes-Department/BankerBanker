import AiChat from './_components/AiChat';
import DocumentList from './_components/DocumentList';
import Preview from './_components/Preview';

const page = () => {
    return (
        <div className='flex flex-col w-full gap-3'>
            <div className='flex flex-col-reverse lg:flex-row gap-3'>
                <DocumentList />
                <AiChat />
            </div>
            <Preview />
        </div>
    );
};

export default page;