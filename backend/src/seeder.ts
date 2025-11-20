import path from 'path'
import fs from 'fs'
import { sequelize } from './config/database'
import { Post, User } from './models'
import { Model, ModelStatic } from 'sequelize'
import { hashPassword, isHash } from './utils/password.utils'

const seed = async () => {
  const models: { model: ModelStatic<Model>; file: string }[] = [
    {
      model: Post,
      file: 'post.seed.json'
    },
    {
      model: User,
      file: 'user.seed.json'
    }
  ]

  await sequelize.authenticate()
  await sequelize.sync({ force: true })

  for (const { model, file } of models) {
    try {
      console.log(`Seeding data for ${model.name}...`)

      // Drop existing data
      await model.truncate({ cascade: true })

      // Parse the seed file
      const filePath = path.resolve(__dirname, `../seeds/${file}`)
      if (!fs.existsSync(filePath)) throw new Error(`Seed file not found: ${filePath}`)

      // Read and parse the JSON file
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      if (!Array.isArray(data)) throw new Error(`Seed file format invalid for ${model.name} — must be an array`)

      // Hash passwords if seeding users
      if (model === User) {
        for (const user of data) {
          if (!isHash(user.password)) {
            user.password = await hashPassword(user.password)
          }
        }
      }

      // Insert data into the database
      await model.bulkCreate(data, { validate: true })
      console.log(`Inserted ${data.length} records into ${model.name} database`)

    } catch (err) {
      console.error(`Error while seeding ${model.name}:`, err)
      process.exit(1)
    }
  }
}

(async () => {
  try {
    await seed()
    console.log('Data seeding completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error running the script:', error)
    process.exit(1)
  } finally {
    await sequelize.close()
  }
})()
