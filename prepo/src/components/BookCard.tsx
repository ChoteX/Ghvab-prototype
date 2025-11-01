import { Link } from 'react-router-dom';

interface BookCardProps {
  image: string;
  title: string;
  subtitle?: string;
  to?: string;
}

const BookCard = ({ image, title, subtitle, to }: BookCardProps) => {
  const content = (
    <div className="relative overflow-hidden rounded-lg shadow-book group-hover:shadow-book-hover transition-all duration-300">
      <img 
        src={image} 
        alt={title}
        className="w-full h-[280px] md:h-[340px] object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-sm font-semibold text-foreground line-clamp-2">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
  return (
    <div className="group relative flex-shrink-0 w-[200px] md:w-[240px] cursor-pointer transition-all duration-300 ease-out hover:scale-110 hover:z-10">
      {to
        ? (to.endsWith('.html') || to.startsWith('http'))
          ? <a href={to}>{content}</a>
          : <Link to={to}>{content}</Link>
        : content}
    </div>
  );
};

export default BookCard;
