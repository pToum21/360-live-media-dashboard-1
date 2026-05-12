-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MARKETER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WebsiteMetric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekStarting" DATETIME NOT NULL,
    "healthScore" REAL,
    "totalUsers" INTEGER NOT NULL,
    "percentChangeUsers" REAL,
    "newUsers" INTEGER NOT NULL,
    "percentChangeNewUsers" REAL,
    "referral" INTEGER,
    "organicSearch" INTEGER,
    "direct" INTEGER,
    "organicSocial" INTEGER,
    "email" INTEGER,
    "unassigned" INTEGER,
    "avgEngagementTimeSec" INTEGER,
    "percentChangeEngTime" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    CONSTRAINT "WebsiteMetric_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmailCampaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "deploymentDate" DATETIME NOT NULL,
    "openRate" REAL NOT NULL,
    "clickRate" REAL NOT NULL,
    "deliveryRate" REAL NOT NULL,
    "unsubscribeRate" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    CONSTRAINT "EmailCampaign_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SocialMetric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekStarting" DATETIME NOT NULL,
    "liFollowerGrowthRate" REAL,
    "liImpressions" INTEGER,
    "liEngagementRate" REAL,
    "liPostsPerWeek" INTEGER,
    "liFollowers" INTEGER,
    "igImpressions" INTEGER,
    "igEngagementRate" REAL,
    "igPostsPerWeek" INTEGER,
    "igFollowers" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    CONSTRAINT "SocialMetric_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SocialPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekStarting" DATETIME NOT NULL,
    "postUrl" TEXT,
    "platform" TEXT NOT NULL,
    "impressions" INTEGER NOT NULL,
    "engagements" INTEGER NOT NULL,
    "engagementRate" REAL NOT NULL,
    "linkClicks" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    CONSTRAINT "SocialPost_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PostTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "PostTag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "SocialPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "month" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "pageViews" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "eventName" TEXT,
    "year" INTEGER NOT NULL,
    "campaignStatus" TEXT NOT NULL,
    "dashboardStatus" TEXT NOT NULL,
    "utmTracking" BOOLEAN NOT NULL DEFAULT false,
    "conversionTracking" TEXT NOT NULL,
    "issueDescription" TEXT,
    "nextSteps" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Optimization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "month" TEXT NOT NULL,
    "channel" TEXT,
    "controlTest" TEXT,
    "testVariant" TEXT,
    "results" TEXT,
    "conclusions" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    CONSTRAINT "Optimization_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "WebsiteMetric_weekStarting_idx" ON "WebsiteMetric"("weekStarting");

-- CreateIndex
CREATE INDEX "EmailCampaign_deploymentDate_idx" ON "EmailCampaign"("deploymentDate");

-- CreateIndex
CREATE INDEX "SocialMetric_weekStarting_idx" ON "SocialMetric"("weekStarting");

-- CreateIndex
CREATE INDEX "SocialPost_weekStarting_idx" ON "SocialPost"("weekStarting");

-- CreateIndex
CREATE INDEX "SocialPost_platform_idx" ON "SocialPost"("platform");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "PostTag_postId_idx" ON "PostTag"("postId");

-- CreateIndex
CREATE INDEX "PostTag_tagId_idx" ON "PostTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "PostTag_postId_tagId_key" ON "PostTag"("postId", "tagId");

-- CreateIndex
CREATE INDEX "Campaign_month_idx" ON "Campaign"("month");

-- CreateIndex
CREATE INDEX "Campaign_source_idx" ON "Campaign"("source");

-- CreateIndex
CREATE INDEX "Client_year_idx" ON "Client"("year");

-- CreateIndex
CREATE INDEX "Optimization_month_idx" ON "Optimization"("month");
