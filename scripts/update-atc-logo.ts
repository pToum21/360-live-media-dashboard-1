import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const atcClient = await prisma.client.findUnique({
    where: { slug: 'atc-2026' }
  })

  if (!atcClient) {
    console.log('ATC client not found')
    return
  }

  await prisma.client.update({
    where: { id: atcClient.id },
    data: {
      logo: '/Logos/Picture1.png'
    }
  })

  console.log('✅ Updated ATC logo')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
