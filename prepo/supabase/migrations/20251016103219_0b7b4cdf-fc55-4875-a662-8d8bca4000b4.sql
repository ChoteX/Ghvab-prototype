-- Create schools table
CREATE TABLE public.schools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('public', 'private')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create textbooks table
CREATE TABLE public.textbooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT,
  grade TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.textbooks ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (anyone can search schools and view textbooks)
CREATE POLICY "Schools are viewable by everyone" 
ON public.schools 
FOR SELECT 
USING (true);

CREATE POLICY "Textbooks are viewable by everyone" 
ON public.textbooks 
FOR SELECT 
USING (true);

-- Create indexes for better search performance
CREATE INDEX idx_schools_name ON public.schools USING gin(to_tsvector('english', name));
CREATE INDEX idx_schools_location ON public.schools USING gin(to_tsvector('english', location));
CREATE INDEX idx_textbooks_school_id ON public.textbooks(school_id);

-- Insert sample data
INSERT INTO public.schools (name, location, type) VALUES
('Komarovi Public School', 'Tbilisi, Georgia', 'public'),
('Buckswood International School', 'East Sussex, England', 'private'),
('Harvard-Westlake School', 'Los Angeles, California', 'private'),
('Wellington College', 'Berkshire, England', 'private');

-- Insert sample textbooks
INSERT INTO public.textbooks (school_id, title, subject, grade) 
SELECT s.id, 'Advanced Mathematics', 'Mathematics', '11th Grade'
FROM public.schools s WHERE s.name = 'Komarovi Public School';

INSERT INTO public.textbooks (school_id, title, subject, grade) 
SELECT s.id, 'Physics: Principles and Problems', 'Physics', '10th Grade'
FROM public.schools s WHERE s.name = 'Komarovi Public School';

INSERT INTO public.textbooks (school_id, title, subject, grade) 
SELECT s.id, 'World History', 'History', '9th Grade'
FROM public.schools s WHERE s.name = 'Buckswood International School';

INSERT INTO public.textbooks (school_id, title, subject, grade) 
SELECT s.id, 'Chemistry in Context', 'Chemistry', '11th Grade'
FROM public.schools s WHERE s.name = 'Buckswood International School';