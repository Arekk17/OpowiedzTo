import React from "react";
import { SearchInput } from "../../atoms/inputs/SearchInput";
import { StoryCard } from "../../molecules/cards/StoryCard";

interface StoriesLayoutProps {
  className?: string;
}

export const StoriesLayout: React.FC<StoriesLayoutProps> = ({
  className = "",
}) => {
  const stories = [
    {
      id: 1,
      title: "Niespodziewane spotkanie",
      excerpt:
        "Historia o tym, jak przypadkowe spotkanie może zmienić całe życie.",
      author: "Anonim",
      timestamp: "2 godziny temu",
      category: "anonymous" as const,
      isAnonymous: true,
      imageSrc:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      imageAlt: "Niespodziewane spotkanie",
    },
    {
      id: 2,
      title: "Sekretne marzenie",
      excerpt: "Opowieść o ukrytych pragnieniach i odwadze, by je spełnić.",
      author: "Anonim",
      timestamp: "4 godziny temu",
      category: "featured" as const,
      isAnonymous: true,
      imageSrc:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=300&fit=crop",
      imageAlt: "Sekretne marzenie",
    },
    {
      id: 3,
      title: "Utracona szansa",
      excerpt: "Refleksja nad momentami, które mogły potoczyć się inaczej.",
      author: "Anonim",
      timestamp: "6 godzin temu",
      category: "trending" as const,
      isAnonymous: true,
    },
    {
      id: 4,
      title: "Powrót do korzeni",
      excerpt: "Historia o powrocie do miejsca, gdzie wszystko się zaczęło.",
      author: "Anonim",
      timestamp: "8 godzin temu",
      category: "new" as const,
      isAnonymous: true,
      imageSrc:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      imageAlt: "Powrót do korzeni",
    },
    {
      id: 5,
      title: "Nowy początek",
      excerpt:
        "Opowieść o przezwyciężaniu przeciwności i rozpoczynaniu od nowa.",
      author: "Anonim",
      timestamp: "10 godzin temu",
      category: "anonymous" as const,
      isAnonymous: true,
      imageSrc:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
      imageAlt: "Nowy początek",
    },
  ];

  return (
    <div
      className={`flex flex-col items-start w-full max-w-[725px] ${className}`}
    >
      <div className="w-full px-4 py-3">
        <SearchInput
          placeholder="Szukaj historii..."
          variant="default"
          size="md"
        />
      </div>

      <div className="w-full px-4 py-5 pb-3">
        <h1 className="font-jakarta font-bold text-[22px] leading-7 text-content-primary">
          Polecane historie
        </h1>
      </div>

      <div className="w-full space-y-4 px-4">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            title={story.title}
            excerpt={story.excerpt}
            author={story.author}
            timestamp={story.timestamp}
            category={story.category}
            isAnonymous={story.isAnonymous}
            imageSrc={story.imageSrc}
            imageAlt={story.imageAlt}
          />
        ))}
      </div>

      <div className="w-full flex justify-center items-center p-4">
        <div className="flex flex-row gap-0">
          <button className="flex flex-row justify-center items-center p-0 w-10 h-10 hover:bg-ui-hover rounded-lg transition-colors">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.25 13.5L6.75 9L11.25 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {[1, 2, 3, 4, 5, 6].map((page) => (
            <button
              key={page}
              className={`
                flex flex-row justify-center items-center p-0 w-10 h-10 rounded-lg transition-colors
                ${
                  page === 1
                    ? "bg-ui-notification text-content-primary"
                    : "hover:bg-ui-hover text-content-secondary"
                }
              `}
            >
              <span
                className={`
                  font-jakarta text-sm leading-[21px]
                  ${page === 1 ? "font-bold" : "font-normal"}
                `}
              >
                {page}
              </span>
            </button>
          ))}

          <button className="flex flex-row justify-center items-center p-0 w-10 h-10 hover:bg-ui-hover rounded-lg transition-colors">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.75 4.5L11.25 9L6.75 13.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
