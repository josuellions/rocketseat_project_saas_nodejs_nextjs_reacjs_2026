import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { getCurrentOrganization } from "@/auth/auth";
import { getBilling } from "@/http/get-billing";

export async function Billing() {
 const currentOrganization = await getCurrentOrganization();
 const { billing } = await getBilling({organization: currentOrganization!})

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing</CardTitle>

      <CardDescription>
        Information about your organization costs.
      </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cost type</TableHead>
              <TableHead className="text-right" style={{width: 120}}>Quantity</TableHead>
              <TableHead className="text-right" style={{width: 200}}>Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Amount of projects</TableCell>
              <TableCell className="text-right">{billing.projects.amount}</TableCell>
              <TableCell className="text-right">({billing.projects.unit.toLocaleString('en-US',{
                style: 'currency',
                currency: 'USD'
              })} each) {billing.projects.price.toLocaleString('en-US',{
                style: 'currency',
                currency: 'USD'
              })} </TableCell>
            </TableRow>
             <TableRow>
              <TableCell>Amount of seats</TableCell>
              <TableCell className="text-right">{billing.seats.amount}</TableCell>
              <TableCell className="text-right">({billing.seats.unit.toLocaleString('en-US',{
                style: 'currency',
                currency: 'USD'
              })} each) {billing.seats.price.toLocaleString('en-US',{
                style: 'currency',
                currency: 'USD'
              })} </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
             <TableRow>
              <TableCell></TableCell>
              <TableCell className="text-right">Total</TableCell>
              <TableCell className="text-right">{billing.total.toLocaleString('en-US',{
                style: 'currency',
                currency: 'USD'
              })}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}