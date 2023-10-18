import { useFetcher, useLoaderData, useRevalidator } from '@remix-run/react';
import { type LoaderFunctionArgs, type LoaderFunction, redirect } from '@vercel/remix';
import { useEffect, useRef, useState } from 'react';
import { BuildingIcon, LoaderIcon } from '~/components/icons';
import { getOrganizationDetails } from '~/lib/session.server';
import type { Message, Organization } from '~/lib/types';
import { getCustomerConversationDetails } from '~/lib/utils';

export const loader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs): Promise<any> => {

  const org: Organization = await getOrganizationDetails({ organizationUsername: params.orgUsername as string }) as Organization;

  if (org === undefined) {
    return redirect(`/`); // * org not exists
  }

  const customer = await getCustomerConversationDetails({ conversationId: params.conversationId as string, org })

  if (!customer.ok) {
    return redirect(`/`); // * unknown ticket
  }

  return {
    ...customer.data,
    org
  }
}

export default function AgentDashboard() {
  // @ts-ignore
  const { conversation, org } = useLoaderData<typeof loader>();
  const sendMessageFetcher = useFetcher();
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
        sender: "customer",
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

      <nav className="flex justify-between border-b">
        <div className="p-4 font-semibold">
          <a href={`/customer/${org.username}/talk/${conversation.id}`} className='flex gap-2 items-center'>
            {org.logo ? <img src={org.logo} className='w-5 h-5' alt={org.name} /> : <BuildingIcon styles='h-6 w-6' />}
            <span>{org.name}</span>
          </a>
        </div>
      </nav>

      <div className='flex justify-center text-md py-8'><code>{conversation.agent.fullName}</code></div>
      <div className='flex flex-col gap-2 py-2 overflow-auto'>
        {conversation.messages.length > 0
          ? conversation.messages.map((message: Message) => <div key={message.id} className={`${message.sender === 'customer' ? 'flex justify-start' : 'flex justify-end'} gap-2 pl-0`}>
            <span className={`${message.sender === 'customer' ? 'bg-blue-400 rounded-bl-none' : 'bg-green-400 rounded-br-none'} rounded-md text-white p-2 select-none`}>{message.message}</span>
          </div>)
          : <p className='grid-cols-2'>Start writing...</p>}
      </div>
      <div className='fixed bottom-0 left-0 right-0 grid-cols-2 bg-white pt-2'>
        <form className='w-full flex gap-4 items-center px-2' onSubmit={sendMessage}>
          <div className='strink-0 w-full'>
            <textarea name="message" id="" rows={2} required onInput={(el) => setMessage(() => (el.target as HTMLInputElement).value)} className='mb-1 appearance-none rounded dark:bg-transparent border focus:border-primary/50 focus:ring-0 w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline border-gray-500 focus-visible:outline-gray-600 resize-none' />
          </div>
          <div className='w-[200px]'>
            <button
              className="bg-primary text-white bg-gray-700 hover:bg-gray-900 rounded py-1 px-2 focus:shadow-outline flex justify-center items-center gap-2 w-full"
              type="submit"
              onClick={sendMessage}
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