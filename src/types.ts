export class Timer{
    private initTimestamp = 0;
    private stopTimestamp = 0;
    private lastTimestamp = 0;
    private timeSpan = 0;

    get timeElapsed(): number { return this.lastTimestamp - this.initTimestamp };

    public onComplete?: () => void;

    constructor(){

    }

    public startTimer(){
        this.initTimestamp = Date.now();
        this.timerLoop();
    }

    public stopTimer(){
        // TODO
    }

    public setTimespan(timeSpan: number){
        this.timeSpan = timeSpan;
    }

    private timerLoop(){
        this.lastTimestamp = Date.now();

        if(this.timeElapsed > this.timeSpan){
            if(!this.onComplete) return
            this.onComplete();
        } else {
            this.timerLoop();
        }
    }
}

export class Clock{
    private initTimestamp = 0;
    private stopTimestamp = 0;
    private lastTimestamp = 0;

    private stopped = false;

    get timeElapsed(): number { return this.lastTimestamp - this.initTimestamp };

    public onRunning?: () => void;

    constructor(){

    }

    public startClock(){
        this.stopped = false;
        this.clockLoop();
    }

    public stopClock(){
        this.stopped = true;
    }

    private clockLoop(){
        this.lastTimestamp = Date.now();
        if(!this.stopped) {
            if(this.onRunning) this.onRunning();
            this.clockLoop();
        }
    }
}