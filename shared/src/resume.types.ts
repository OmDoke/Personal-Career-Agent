export interface OptimizedResume {
    atsScore: number;
    analysis: string;
    optimizedData: {
        header: {
            name: string;
            email: string;
            phone: string;
            linkedin?: string;
            github?: string;
        };
        summary: string;
        skills: {
            languages?: string;
            frameworks?: string;
            tools?: string;
            other?: string;
        };
        experience: {
            company: string;
            role: string;
            dates: string;
            bullets: string[];
        }[];
        projects: {
            name: string;
            techStack: string;
            bullets: string[];
        }[];
        education: {
            degree: string;
            university: string;
            year: string;
        }[];
    };
}
