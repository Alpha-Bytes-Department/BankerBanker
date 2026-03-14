import AiChat from './_components/AiChat';
import DocumentList from './_components/DocumentList';
import Preview from './_components/Preview';

const page = () => {
    return (
        <div className='flex flex-col w-full gap-3 p-3 sm:p-4 min-h-screen'>
            <div className='flex flex-col lg:flex-row gap-3 flex-1'>
                <div className='w-full lg:flex-[1.4] min-h-0'>
                    <Preview />
                </div>
                <div className='w-full lg:flex-1 min-h-0'>
                    <AiChat />
                </div>
            </div>
            <div className='w-full'>
                <DocumentList />
            </div>
        </div>
    );
};

export default page;
