const { gql } = require('apollo-server')

const typeDefs = gql`
    type Query {
        equipments: [Equipment]
        equipmentAdvs: [EquipmentAdv]
        softwares: [Software]
        software: Software
        supplies: [Supply]
        givens: [Given]
        people: [People]
        peopleFiltered(
            team: Int, 
            sex: Sex, 
            blood_type: BloodType, 
            from: String
        ): [People]
        peoplePaginated(
            team: Int, 
            sex: Sex, 
            blood_type: BloodType, 
            from: String
            page: Int!,
            per_page: Int!
        ): [People]
    }
`

module.exports = typeDefs