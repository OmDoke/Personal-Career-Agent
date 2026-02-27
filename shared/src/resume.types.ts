export interface OptimizedResume {
    ats_match_score: number;
    missing_skills: string[];
    matching_skills: string[];
    optimization_suggestions: string[];
    optimized_resume_content: {
        summary: string;
        experience_bullets: string[];
    };
}
