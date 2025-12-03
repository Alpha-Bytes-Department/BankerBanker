interface ReviewCardProps {
    name: string,
    review: string
}

export default function ReviewCard({ name, review }: ReviewCardProps) {
    return (
        <div>
            <h1>{name}</h1>
            <p>{review}</p>
        </div>
    );
}