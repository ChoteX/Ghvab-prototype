import React from 'react';

import { Link } from 'react-router-dom';

interface BookRowProps {
  images: string[];
  links?: (string | undefined)[];
}

const BookRow: React.FC<BookRowProps> = ({ images, links }) => {
  return (
    <div className="relative mb-12">
        <h3 className="text-2xl font-bold mb-4">Popular Textbooks</h3>
        <div className="overflow-x-auto pb-4">
            <div className="flex space-x-6">
                {images.map((src, index) => {
                    const content = (
                        <img
                            src={src}
                            alt={`Book cover ${index + 1}`}
                            className="w-full h-96 object-cover rounded-md shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-200 ease-in-out cursor-pointer"
                        />
                    );
                    const maybeLink = links?.[index];
                    return (
                        <div key={index} className="flex-shrink-0 w-64">
                            {maybeLink
                              ? (maybeLink.endsWith('.html') || maybeLink.startsWith('http'))
                                  ? <a href={maybeLink}>{content}</a>
                                  : <Link to={maybeLink}>{content}</Link>
                              : content}
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};

export default BookRow;
