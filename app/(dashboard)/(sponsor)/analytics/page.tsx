import AiChat from './_components/AiChat';
import DocumentList from './_components/DocumentList';
import Preview from './_components/Preview';

const page = () => {
    return (
        <div className='flex flex-col-reverse md:flex-row w-full gap-5'>
            <DocumentList/>
            <Preview/>
            <AiChat/>
        </div>
    );
};

export default page;