import { ability, getCurrentOrganization } from "@/auth/auth";
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { OrganizationForm } from "../../organization-form";
import { DeleteOrganizationButton } from "./delete-organization-button";
import { getOrganization } from "@/http/get-organization";
import { Billing } from "./billing";

export default async function Settings() {
  const permissions = await ability();
  const currentOrganization = await getCurrentOrganization();

  const { organization } = await getOrganization({organization: currentOrganization!})

  const canUpdateOrganization = permissions?.can('update', 'Organization');
  const deleteOrganization = permissions?.can('delete', 'Organization');
  const canGetBilling = permissions?.can('get', 'Billing');

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h1 className="w-full text-2xl font-bold">Settings</h1>
        {canUpdateOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Organization settings</CardTitle>

            <CardDescription>
              Update your organization details
            </CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizationForm isUpdate initialData={{
                name: organization?.name,
                domain: organization?.domain,
                shouldAttachUsersByDomain: organization?.shouldAttachUsersByDomain
              }}/>
            </CardContent>
          </Card>
        )}

        {canGetBilling && (
            <Billing />
        )}

        {deleteOrganization && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Delete Organization</CardTitle>

              <CardDescription>
               This will delete all organization data including all projects. You cannot undo this action.
              </CardDescription>
              </CardHeader>
              <CardContent>
                <DeleteOrganizationButton />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}