import Button from "@/components/Button";
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const ProfilePopUp = () => {
    return (
        <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                    Make changes to your profile here. Click save when you&apos;re
                    done.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
                Hello how are you
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button text="Cancel" className="button-outline"/>
                </DialogClose>
                <Button text="Save Changes" type="submit" className="button-primary"/>
            </DialogFooter>
        </DialogContent>

    );
};

export default ProfilePopUp;