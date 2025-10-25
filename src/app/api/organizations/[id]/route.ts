import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const organizationId = params.id

        // Get organization details
        const organization = db.prepare('SELECT * FROM organizations WHERE id = ?').get(organizationId)

        if (!organization) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
        }

        // Get organization details (farm-specific info)
        const organizationDetails = db.prepare('SELECT * FROM organization_details WHERE organization_id = ?').get(organizationId)

        // Get user organizations for this org
        const userOrganizations = db.prepare(`
      SELECT uo.*, u.first_name, u.last_name, u.email 
      FROM user_organizations uo 
      JOIN users u ON uo.user_id = u.id 
      WHERE uo.organization_id = ?
    `).all(organizationId)

        // Defensive checks for organization and organizationDetails, return empty object if fields missing
        function safeOrg(org: any) {
            return {
                id: org?.id ?? null,
                name: org?.name ?? null,
                type: org?.type ?? null,
                description: org?.description ?? null,
                website: org?.website ?? null,
                logoUrl: org?.logo_url ?? null,
                isActive: org?.is_active ?? null,
                createdAt: org?.created_at ?? null,
                updatedAt: org?.updated_at ?? null
            }
        }

        function safeOrgDetails(details: any) {
            if (!details) return null;
            let mainEnterprises = null;
            try {
                mainEnterprises = details.main_enterprises ? JSON.parse(details.main_enterprises) : null;
            } catch {
                mainEnterprises = null;
            }
            return {
                id: details?.id ?? null,
                organizationId: details?.organization_id ?? null,
                enterpriseType: details?.enterprise_type ?? null,
                mainEnterprises,
                location: {
                    district: details?.district ?? null,
                    subCounty: details?.sub_county ?? null,
                    parish: details?.parish ?? null,
                    village: details?.village ?? null,
                },
                farmSize: details?.farm_size_acres ?? null,
                farmStage: details?.farm_stage ?? null,
                contactPerson: {
                    name: details?.contact_person_name ?? null,
                    title: details?.contact_person_title ?? null
                },
                whatsappContact: details?.whatsapp_contact ?? null,
                email: details?.email ?? null,
                createdAt: details?.created_at ?? null,
                updatedAt: details?.updated_at ?? null
            }
        }

        return NextResponse.json({
            organization: safeOrg(organization),
            organizationDetails: safeOrgDetails(organizationDetails),
            userOrganizations
        })
    } catch (error) {
        console.error('Error fetching organization:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

