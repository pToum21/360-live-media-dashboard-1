import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkAllSocialFields() {
  const atc = await prisma.client.findUnique({
    where: { slug: 'atc-2026' },
  })
  
  if (!atc) {
    console.log('ATC client not found')
    return
  }
  
  const social = await prisma.socialMetric.findFirst({
    where: { clientId: atc.id },
    orderBy: { weekStarting: 'desc' },
  })
  
  console.log('\n📊 All ATC Social Metric Fields:\n')
  console.log(JSON.stringify(social, null, 2))
}

checkAllSocialFields()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
