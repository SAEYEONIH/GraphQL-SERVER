const database = require('./database')
const { ApolloServer, gql } = require('apollo-server')

const typeDefs = gql`
  type Query {
    teams: [Team]
    equipments: [Equipment]
    supplies: [Supply]
    team(id: Int): Team
  }

  type Mutation {
    insertEquipment(
        id: String,
        used_by: String,
        count: Int,
        new_or_used: String
    ): Equipment,
    editEquipment(
        id: String,
        used_by: String,
        count: Int,
        new_or_used: String
    ): Equipment,
    deleteEquipment(
        id: String): Equipment
  }

  type Team {
    id: Int
    manager: String
    office: String
    extension_number: String
    mascot: String
    cleaning_duty: String
    project: String
    supplies: [Supply]
  }

  type Equipment {
    id: String
    used_by: String
    count: Int
    new_or_used: String
  }

  type Supply {
    id: String
    team: Int
  }
`

const resolvers = {
  Query: {
    teams: () => database.teams,
    equipments: () => database.equipments,
    supplies: () => database.supplies,

    // 특정 team만 받아오기
    team: (parent, args, context, info) => database.teams
      .filter((team) => {
        return team.id === args.id
      })[0],

    // team에 supplies 연결해서 받아오기
    teams: () => database.teams
      .map((team) => {
        team.supplies = database.supplies
          .filter((supply) => {
            return supply.team === team.id
          })
        return team
      }),
  },

  Mutation: {
    insertEquipment: (parent, args, context, info) => {
      database.equipments.push(args)
      return args
    },
    editEquipment: (parent, args, context, info) => {
      return database.equipments.filter((equipment) => {
        return equipment.id === args.id
      }).map((equipment) => {
        Object.assign(equipment, args)
        return equipment
      })[0]
    },
    deleteEquipment: (parent, args) => {
      const deleted = database.equipments.find((equipment) => {
        return equipment.id === args.id
      })
      database.equipments = database.equipments.filter((equipment) => {
        return equipment.id !== args.id
      })
      return deleted
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})