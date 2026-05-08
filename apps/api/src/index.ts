import { defineAbilityFor } from "@saas_node_next_react/auth";

const ability = defineAbilityFor({ id: "user-id" , role : 'ADMIN' })

// const userCanInviteSomeoneElse = ability.can('invite', 'User');
const userCanDeleteOtherUsers = ability.can('delete', 'User');
const userCannotDeleteOtherUsers = ability.cannot('delete', 'User')

console.log(">> Server api start...")
// console.log({"user pode convidar": userCanInviteSomeoneElse})
console.log({"user pode deletar": userCanDeleteOtherUsers})
console.log({"user não pode deletar outros users": userCannotDeleteOtherUsers})
