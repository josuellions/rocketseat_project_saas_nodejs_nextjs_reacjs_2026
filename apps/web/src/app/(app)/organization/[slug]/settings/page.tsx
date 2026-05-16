import { ability } from "@/auth/auth";
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { OrganizationForm } from "../../organization-form";
import { DeleteOrganizationButton } from "./delete-organization-button";

export default async function Settings() {
 const permissions = await ability();

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
              <OrganizationForm/>
            </CardContent>
          </Card>
        )}

        {canGetBilling && (
          <div>
            <h2 className="w-full text-2xl font-bold">Billing</h2>
          </div>
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