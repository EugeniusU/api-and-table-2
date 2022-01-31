export class CreateLeadDto {
    readonly id: number
    readonly externalId: number
    readonly name: string
    readonly budget: number
 ///   readonly status: JSON
    readonly status: string
}