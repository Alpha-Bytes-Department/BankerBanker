import MessageList from "./_components/MessageList";
import MessageText from "./_components/MessageText";



const page = () => {
    return (
        <div className="flex gap-5">
            <MessageList/>
            <MessageText/>
        </div>
    );
};

export default page;