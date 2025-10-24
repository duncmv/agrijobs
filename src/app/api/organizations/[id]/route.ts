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

        return NextResponse.json({
            organization: {
                id: organization.id,
                name: organization.name,
                type: organization.type,
                description: organization.description,
                website: organization.website,
                logoUrl: organization.logo_url,
                isActive: organization.is_active,
                createdAt: organization.created_at,
                updatedAt: organization.updated_at
            },
            organizationDetails: organizationDetails ? {
                id: organizationDetails.id,
                organizationId: organizationDetails.organization_id,
                enterpriseType: organizationDetails.enterprise_type,
                mainEnterprises: JSON.parse(organizationDetails.main_enterprises),
                location: {
                    district: organizationDetails.district,
                    subCounty: organizationDetails.sub_county,
                    parish: organizationDetails.parish,
                    village: organizationDetails.village
                },
                farmSize: organizationDetails.farm_size_acres,
                farmStage: organizationDetails.farm_stage,
                contactPerson: {
                    name: organizationDetails.contact_person_name,
                    title: organizationDetails.contact_person_title
                },
                whatsappContact: organizationDetails.whatsapp_contact,
                email: organizationDetails.email,
                createdAt: organizationDetails.created_at,
                updatedAt: organizationDetails.updated_at
            } : null,
            userOrganizations
        })
    } catch (error) {
        console.error('Error fetching organization:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

