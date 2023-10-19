import { useFetcher, useLoaderData } from '@remix-run/react';
import { type LoaderFunctionArgs, type LoaderFunction, redirect } from '@vercel/remix';
import { buildDbClient as buildOrgDbClient } from '~/lib/client-org';
import { getAgentDetails, requireAgentId } from '~/lib/agent-session.server';
import { getOrganizationDetails } from '~/lib/session.server';
import type { Agent, Conversation, Organization, Ticket } from '~/lib/types';
import { unixepochToDate } from '~/lib/utils';

export const loader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs): Promise<any> => {
  const org: Organization | undefined = await getOrganizationDetails({ organizationUsername: params.orgUsername as string }) as Organization;

  const agentId = await requireAgentId({ request, redirectTo: `/agent/${org.username}/login` });
  if (agentId === undefined) {
    return redirect(`/agent/${org.username}/login`); // * no agent (user) session
  }

  const fetchAgent = await getAgentDetails({ agentId, org });

  if (!fetchAgent.ok) {
    return redirect(`/agent/${org.username}/login`); // * agent not exists
  }

  const db = buildOrgDbClient({ url: org.dbUrl as string });

  // fetch open org tickets
  const tickets = await db.query.tickets.findMany({
    where: (tickets, { eq }) => eq(tickets.isClosed, 0)
  });

  // fetch agent conversations
  const conversations = await db.query.conversations.findMany({
    where: (conversations, { eq }) => eq(conversations.agentId, agentId),
    with: {
      ticket: true,
    }
  });

  return {
    tickets: tickets as unknown as Ticket[],
    conversations: conversations as unknown as Conversation[],
    agent: fetchAgent.agent as unknown as Agent,
    org
  };
}

export default function AgentDashboard() {
  // @ts-ignore
  const { tickets, conversations, org } = useLoaderData<typeof loader>();
  const startConversationFetcher = useFetcher();

  return (
    <div className="grid grid-cols-2 w-full min-h-screen px-4">
      <div className='p-2 h-full'>
        <h2 className="text-2xl text-accent-800 text-left mb-8">Open Tickets.</h2>

        {tickets.length > 0 ? <ul className='list-none p-2 flex flex-col gap-2'>
          {tickets.map((ticket: Ticket) => <li key={ticket.id}>
            <div className='flex gap-4 justify-between items-center ring-[1px] ring-gray-200 p-2'>
              <div className='flex flex-col'>
                <span>{ticket.customerName}</span>
                <span className='text-sm text-gray-400'>{unixepochToDate(ticket.createdAt as number)}</span>
              </div>
              <startConversationFetcher.Form
                action='/agent-actions'
                method='post'
              >
                <input type="hidden" name="organization_id" value={org.id} />
                <input type="hidden" name="ticket_id" value={ticket.id} />
                <button className='px-2 py-1 border border-gray-300 hover:border-gray-600 rounded-md text-sm'
                  name='_action'
                  value="startConversation"
                >Engage</button>
              </startConversationFetcher.Form>
            </div>
          </li>)}
        </ul> : <div>No tickets opened in your organization</div>}
      </div>

      <div className='p-2 h-full'>
        <h2 className="text-2xl text-accent-800 text-left mb-8">My Conversations.</h2>

        {conversations.length > 0 ? <ul className='list-none p-2 flex flex-col gap-2'>
          {conversations.map((conversation: Conversation & { ticket: Ticket }) => <li key={conversation.id}>
            <div className='flex gap-4 justify-between items-center ring-[1px] ring-gray-200 p-2'>
              <div className='flex flex-col'>
                <span>{conversation.ticket.customerName}</span>
                <span className='text-sm text-gray-400'>{unixepochToDate(conversation.createdAt as number)}</span>
              </div>
              <startConversationFetcher.Form
                action='/agent-actions'
                method='post'
              >
                <input type="hidden" name="organization_id" value={org.id} />
                <input type="hidden" name="ticket_id" value={conversation.ticket.id} />
                <a className='px-2 py-1 border border-gray-300 hover:border-gray-600 rounded-md text-sm'
                  href={`/agent/${org.username}/talk/${conversation.id}`}
                >Chat</a>
              </startConversationFetcher.Form>
            </div>
          </li>)}
        </ul> : <div> You have no active conversations</div>}
      </div>
    </div>
  );
}