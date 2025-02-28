export interface Child {
    id:                number;
    content:           string;
    blocked:           boolean;
    blockedThread:     boolean;
    blockReason:       null;
    isAdminComment:    null;
    removed:           null;
    approvalStatus:    null;
    createdAt:         Date;
    updatedAt:         Date;
    gotThread:         boolean;
    threadFirstItemId: number;
    author:            Author;
    children:          Comment[];
}

export interface Comment {
    id:                 number;
    content:            string;
    blocked:            boolean;
    blockedThread:      boolean;
    blockReason:        null;
    isAdminComment:     null;
    removed:            null;
    approvalStatus:     null;
    createdAt:          Date;
    updatedAt:          Date;
    gotThread:          boolean;
    threadFirstItemId?: number;
    author:             Author;
    children:           Child[];
}

export interface Author {
    id:     string;
    name:   string;
    email?:  string;
    avatar?: string;
}
