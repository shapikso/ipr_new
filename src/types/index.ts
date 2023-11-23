
export interface VideoInterface {
    path: string;
    url?: string
}

export interface VideoItemInterface {
    [key: string]: VideoInterface
}

export interface saveVideoResponse {
    code: 'successes' | 'error',
    data: VideoItemInterface,
}
