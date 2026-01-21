import { DurationSettings } from "src/time-entry/duration/duration-settings.entity";
import { AmountSettings, HourlyRateSettings, MinBillableSettings } from "../amount-settings.entity";

export class Project {
	name: string;
	settings: {
		amount: ProjectAmountSettings,
		duration: ProjectDurationSettings
	};

	company: Company;
}

export class User {
	name: string;
	settings: {
		amount: UserAmountSettings
	};

	company: string;
}

export class Company {
	name: string;
	settings: {
		amount: AmountSettings,
		duration: DurationSettings
	}
}

export interface UserAmountSettings extends Partial<HourlyRateSettings> {
	// ogni utente può avere il suo costo orario
}

export interface ProjectAmountSettings extends Partial<MinBillableSettings> {
	// chiave utente per definire le tariffe orarie diverse degli utenti per questo progetto
	userSettings: {userId: string, settings: HourlyRateSettings }[];
	//in più ha le impostazioni per il minimo tempo fatturabile
}

export interface TimeEntryAmountSettings extends Partial<HourlyRateSettings> {
	// ogni time entry può avere il suo costo orario
}

export interface ProjectDurationSettings extends Partial<DurationSettings> {
	// ogni progetto può avere le sue impostazioni per la durata
}
