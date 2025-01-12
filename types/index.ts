export type ScheduleItem = {
    id: string;
    day: string;
    fromTime: string;
    tillTime: string;
    isActive: boolean;
    userId: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
};

export type EventPayloadType = {
    title: string;
    description: string;
    duration: string;
    url: string;
    videoCallSoftware: string;
}

export interface EventType {
    id: string;
    description: string;
    title: string;
    duration: number;
    videoCallSoftware: string;
    user: {
        image: string;
        name: string;
        Availability: {
            day: string;
            isActive: boolean;
        }[];
    };
}

export interface MeetingType {
    busy: boolean;
    calendarId: string;
    conferencing: {
        provider: string;
        details: {
            meetingCode: string;
            url: string;
        };
    };
    description: string;
    textDescription: string;
    hideParticipants: boolean;
    icalUid: string;
    organizer: {
        name: string;
        email: string;
    };
    participants: Array<{
        email: string;
        name: string;
        status: string;
    }>;
    resources: Array<any>;
    readOnly: boolean;
    reminders: {
        useDefault: boolean;
        overrides: Array<any>;
    };
    title: string;
    visibility: string;
    creator: {
        name: string;
        email: string;
    };
    htmlLink: string;
    grantId: string;
    id: string;
    object: string;
    status: string;
    when: {
        startTimezone: string;
        endTimezone: string;
        object: string;
        startTime: number;
        endTime: number;
    };
    createdAt: number;
    updatedAt: number;
}


export interface meetingsResponse {
    data: MeetingType[]
    requestId: string
}