import { CommandInterface } from '../../typedefs'

export default class Ping implements CommandInterface {
    public process(): string {
        return "Pong!"
    }
}