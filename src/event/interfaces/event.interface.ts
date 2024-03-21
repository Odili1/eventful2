export interface Event{
    id?: string,
    eventTitle: string,
    eventDetails: string,
    eventType: string,
    industry: string,
    slots: string,
    address: string,
    city: string,
    country: string,
    tags?: object,
    startDate: Date,
    endDate: Date,
    attendees?: object[],
    attendants?: object[],
    creator?: object 
}