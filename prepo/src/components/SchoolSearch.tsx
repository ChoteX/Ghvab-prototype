import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { schools as allSchools } from "@/data/schools";
import { textbooks as allTextbooks } from "@/data/textbooks";
import BookCard from "./BookCard";
import BookRow from "./BookRow";
import book1 from "@/assets/book1.png";
import book2 from "@/assets/book2.png";
import book3 from "@/assets/book3.png";
import book4 from "@/assets/ghvab.png";
import book5 from "@/assets/book5.png";
import book6 from "@/assets/book6.png";
import ghvab from "@/assets/ghvab.png";
import { Button } from "./ui/button";

const bookImages = [book1, book2, book3, book4, book5, book6];

const SchoolSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSchools, setFilteredSchools] = useState<typeof allSchools>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSchools(allSchools);
    } else {
      const results = allSchools.filter(school =>
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSchools(results);
    }
  }, [searchQuery]);

  const textbooks = allTextbooks.filter(tb => tb.school_id === selectedSchoolId);
  const selectedSchool = allSchools.find(s => s.id === selectedSchoolId);

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-center mb-6">
          Find your institution's textbooks
        </h2>
        
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for schools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 px-6 text-lg bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary"
          />
        </div>
      </div>

      {!selectedSchoolId && (
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid gap-4">
            {filteredSchools.map((school) => (
              <div
                key={school.id}
                className="bg-card p-6 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                onClick={() => setSelectedSchoolId(school.id)}
              >
                <h4 className="text-xl font-semibold mb-2">{school.name}</h4>
                <p className="text-muted-foreground">{school.location}</p>
                <p className="text-sm text-accent mt-1 capitalize">{school.type} School</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedSchool && (
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold mb-2">{selectedSchool.name}</h3>
              <p className="text-muted-foreground text-lg">{selectedSchool.location}</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => {
                setSelectedSchoolId(null);
                setSearchQuery("");
              }}
            >
              Back to Search
            </Button>
          </div>

          {textbooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {textbooks.map((book, index) => {
                const imageSrc = bookImages[index % bookImages.length];
                const to = imageSrc === ghvab ? "/par1.html" : undefined;
                return (
                  <BookCard
                    key={book.id}
                    image={imageSrc}
                    title={book.title}
                    subtitle={`${book.subject || ""} ${book.grade || ""}`.trim()}
                    to={to}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              No textbooks found for this institution.
            </div>
          )}
        </div>
      )}

      {searchQuery.trim() && filteredSchools.length === 0 && !selectedSchoolId && (
        <div className="text-center text-muted-foreground">
          No schools found. Try a different search term.
        </div>
      )}

      {!selectedSchoolId && (
        <BookRow 
          images={[...bookImages, ghvab]}
          links={[
            ...new Array(bookImages.length).fill(undefined),
            "/par1.html",
          ]}
        />
      )}
      
    </section>
  );
};

export default SchoolSearch;
