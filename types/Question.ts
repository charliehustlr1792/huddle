export interface Question{
    id: number;
    question: string | any;
    answer: string | string[];
    type?: 'text' | 'image' | 'audio' | 'file';
    media?: string;
    shift?: number;
    case_sensitive: boolean;
}