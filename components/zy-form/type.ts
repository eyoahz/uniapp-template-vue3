export type DateTimePickerMode = 'dateTimePicker' | 'datePicker' | 'timePicker' | 'yearMonthPicker'

export type DateTimePickerRawMode = 'datetime' | 'date' | 'time' | 'year-month'

export interface TimeType {
	dateTimePicker: string | number;
	datePicker: string | number;
	timePicker: string | number;
	yearMonthPicker: string | number;
}

export interface FieldType {
	dateTimePicker: string | number;
	datePicker: string | number;
	timePicker: string | number;
	yearMonthPicker: string | number;
}
