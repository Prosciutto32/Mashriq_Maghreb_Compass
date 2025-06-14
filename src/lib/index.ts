export type TypeRequest = {
    id: string;
    projectTitle: string;
    status: string;
    createdAt: string;
    entityType: string;
    fullName: string;
    location: string;
    phone: number;
    serviceType: string;
    additionalInfo: string;
    projectDescription: string;
    projectRegion: string;
    projectStart: string;
    projectEnd: string;
    userId: string;
};

export type Post = {
    id: string;
    title:string;
    description: string;
    photo: string;
    createdAt: string;
};