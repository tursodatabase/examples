import { useFetcher, useLoaderData, useRevalidator } from '@remix-run/react';
import { type LoaderFunctionArgs, type LoaderFunction, redirect } from '@vercel/remix';
import { useEffect, useRef, useState } from 'react';
import { LoaderIcon } from '~/components/icons';
import { requireAgentId } from '~/lib/agent-session.server';
import { getOrganizationDetails } from '~/lib/session.server';
import type { Message, Organization } from '~/lib/types';
import { getConversationDetails } from '~/lib/utils';

export const loader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs): Promise<any> => {

  const org: Organization | undefined = await getOrganizationDetails({ organizationUsername: params.orgUsername as string }) as Organization;

  const agentId = await requireAgentId({ request, redirectTo: `/agent/${org.username}/login` });
  if (agentId === undefined) {
    return redirect(`/${org.username}/login`); // * no agent (user) session
  }

  const conversation = await getConversationDetails(params.conversationId as string, org)

  return {
    conversation,
    org
  };
}

export default function AgentConversation() {
  // @ts-ignore
  const { conversation, org } = useLoaderData<typeof loader>();
  const sendMessageFetcher = useFetcher();
  const closeTicketFetcher = useFetcher();
  const [message, setMessage] = useState("");
  const revalidator = useRevalidator();
  const initialCall = useRef(true);

  useEffect(() => {
    if (initialCall.current) {
      initialCall.current = false
      return;
    }
    setInterval(() => {
      revalidator.revalidate();
    }, 15000)

    return () => { }
  }, [])

  const sendMessage = async () => {

    if (message !== "") {
      const messageDetails = {
        _action: "sendMessage",
        message,
        sender: "agent",
        conversation_id: conversation.id,
        organization_username: org.username,
      };

      sendMessageFetcher.submit(messageDetails, {
        method: "post",
        action: "/general-actions"
      })
      setMessage(() => "")
      revalidator.revalidate();

    }
  }

  return (
    <div className="flex flex-col w-full min-h-[90vh] px-4">

      <div className='flex justify-between items-center text-md mb-2 gap-4'>
        <span>{conversation.ticket.customerName}</span>
        {conversation.ticket.isClosed === 0 ? <closeTicketFetcher.Form method='post' action='/agent-actions'>
          <button
            className="bg-primary text-red-800 text-sm bg-red-100 hover:bg-red-200 rounded py-1 px-2 focus:shadow-outline flex justify-center items-center gap-2 w-full"
            type="submit"
            name='_action'
            value='closeTicket'
          >
            <input type="hidden" name='ticket_id' value={conversation.ticket.id} />
            <input type="hidden" name='organization_id' value={org.id} />
            {closeTicketFetcher.state === "submitting" && !closeTicketFetcher.data && <LoaderIcon styles="h-2 w-2 animate-spin fill-red-400" />}
            <span>Close Ticket</span>
          </button>
        </closeTicketFetcher.Form> : <span className='text-gray-300'>Closed</span>}
      </div>
      <div className='flex flex-col gap-2 py-2 overflow-hidden'>
        {conversation.messages.length > 0
          ? conversation.messages.map((message: Message) => <div key={message.id} className={`${message.sender === 'agent' ? 'flex justify-start' : 'flex justify-end'} gap-2 pl-0`}>
            <span className={`${message.sender === 'agent' ? 'bg-blue-400 rounded-bl-none' : 'bg-green-400 rounded-br-none'} rounded-md text-white p-2 select-none`}>{message.message}</span>
          </div>)
          : <p className='grid-cols-2'>Start writing...</p>}
      </div>
      <div className='fixed bottom-0 left-0 right-0 grid-cols-2 bg-white pt-2'>
        <form className='w-full flex gap-4 items-center px-2' onSubmit={(sendMessage)}>
          <div className='strink-0 w-full'>
            <textarea name="message" id="" rows={2} required onInput={(el) => setMessage(() => (el.target as HTMLInputElement).value)}
              disabled={conversation.ticket.isClosed === 1} className='mb-1 appearance-none rounded dark:bg-transparent border focus:border-primary/50 focus:ring-0 w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline border-gray-500 focus-visible:outline-gray-600 resize-none' />
          </div>
          <div className='w-[200px]'>
            <button
              className="bg-primary text-white bg-gray-700 hover:bg-gray-900 disabled:opacity-30 rounded py-1 px-2 focus:shadow-outline flex justify-center items-center gap-2 w-full"
              type="submit"
              onClick={sendMessage}
              disabled={conversation.ticket.isClosed === 1}
            >
              {sendMessageFetcher.state === "submitting" && !sendMessageFetcher.data && <LoaderIcon styles="h-4 w-4 animate-spin fill-white" />}
              <span>Send message</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}