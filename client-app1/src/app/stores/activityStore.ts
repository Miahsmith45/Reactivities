import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../layout/models/activity";
import agent from "../layout/api/agent";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;


    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) =>
            Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();

            activities.forEach(activity => {
                this.setactivity(activity);
            })
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);

            this.setLoadingInitial(false);


        }
    }

    loadActivity = async (id: string) => {
        let activity = this.getActiviy(id);
        if (activity) {
            this.selectedActivity = activity;
            return activity;
        }
        else {
            this.setLoadingInitial(true);
            try {
                activity = await agent.Activities.details(id);
                this.setactivity(activity);
                runInAction(()=> this.selectedActivity = activity)
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false)
            }
        }
    }

    private setactivity = (activity: Activity) => {
        activity.date = activity.date.split('T')[0];
        this.activityRegistry.set(activity.id, activity);
    }


    private getActiviy = (id: string) => {
        return this.activityRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }


    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = crypto.randomUUID()
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity)
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false
            })
        }
    }
}