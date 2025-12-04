// Fahim
import Image from "next/image";

interface ReviewCardProps {
    image: string,
    name: string,
    review: string
}

export default function ReviewCard({ image, name, review }: ReviewCardProps) {
    return (
        <div className="flex flex-col gap-4 border border-[#E5E7EB] max-w-[400px] h-[300px] p-4 lg:p-8 rounded-4xl">
            <div className="relative w-16 h-16 ">
                <Image src={image} alt={image} fill className="rounded-full" />
            </div>
            <h1 className="font-semibold text-xl">{name}</h1>
            <p className="text-sm">{review}</p>
        </div>
    );
}