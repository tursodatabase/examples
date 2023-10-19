import { useLoaderData, useRevalidator } from '@remix-run/react';
import { type LoaderFunctionArgs, type LoaderFunction, redirect } from '@vercel/remix';
import { useEffect, useRef } from 'react';
import { getOrganizationDetails, requireOrganizationId } from '~/lib/session.server';
import type { Message, Organization } from '~/lib/types';
import { getConversationDetails } from '~/lib/utils';

export const loader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs): Promise<any> => {

  const orgId = await requireOrganizationId({ request, redirectTo: "/login" });

  if (orgId === undefined) {
    return redirect("/login");
  }

  const org = await getOrganizationDetails({ organizationId: orgId as string }) as Organization;

  const conversation = await getConversationDetails(params.conversationId as string, org)

  return {
    conversation,
  };
}

export default function OrganizationConversationPreview() {
  // @ts-ignore
  const { conversation } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const initialCall = useRef(true);

  useEffect(() => {
    if (initialCall.current) {
      initialCall.current = false
      return;
    }
    if (conversation.ticket.isClosed === 0) {
      setInterval(() => {
        revalidator.revalidate();
      }, 15000)
    }

    return () => { }
  }, [])


  return (
    <div className="flex flex-col w-full min-h-[90vh] px-4">

      <div className='flex justify-between items-center text-md mb-2 gap-4'>
        <span>
          <span className='text-gray-300'>Agent: </span>
          {conversation.agent.fullName}</span>
        <span>
          <span className='text-gray-300'>Customer: </span>
          {conversation.ticket.customerName}</span>
      </div>
      <div className='flex flex-col gap-2 py-2 overflow-hidden'>
        {conversation.messages.length > 0
          ? conversation.messages.map((message: Message) => <div key={message.id} className={`${message.sender === 'agent' ? 'flex justify-start' : 'flex justify-end'} gap-2 pl-0`}>
            <span className={`${message.sender === 'agent' ? 'bg-blue-400 rounded-bl-none' : 'bg-green-400 rounded-br-none'} rounded-md text-white p-2 select-none`}>{message.message}</span>
          </div>)
          : <p className='grid-cols-2'>No messages...</p>}
      </div>
    </div>
  );
}