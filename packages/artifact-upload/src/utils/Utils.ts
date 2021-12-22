import { v4 as uuidv4 } from 'uuid';
import { v5 as uuidv5 } from 'uuid';
import { UPLOADER_UUID_CONST } from '../constats';

export default class Utils {
    
    /**
    * Generates id in UUID format.
    * @return {string} generated id
    */
    static generateId(): string {
        return uuidv4();
    }
    
    /**
    * Generates id in UUID format with given value
    * @param value value
    */
    static generareIdFrom(value: string): string {
        return uuidv5(value, UPLOADER_UUID_CONST);
    }
}