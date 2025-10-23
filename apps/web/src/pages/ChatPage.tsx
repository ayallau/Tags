export default function ChatPage() {
  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-foreground mb-4'>Chat</h1>
        <p className='text-muted-foreground'>Your conversations</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Conversations List */}
        <div className='lg:col-span-1 space-y-3'>
          <h2 className='text-lg font-semibold'>Conversations</h2>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='bg-surface border border-border rounded-lg p-3'>
              <div className='flex items-center gap-3'>
                <div className='h-10 w-10 bg-muted animate-pulse rounded-full' />
                <div className='flex-1 space-y-1'>
                  <div className='h-4 w-24 bg-muted animate-pulse rounded-md' />
                  <div className='h-3 w-32 bg-muted animate-pulse rounded-md' />
                </div>
                <div className='text-right space-y-1'>
                  <div className='h-3 w-12 bg-muted animate-pulse rounded-md' />
                  <div className='h-4 w-4 bg-muted animate-pulse rounded-full' />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Area */}
        <div className='lg:col-span-2'>
          <div className='bg-surface border border-border rounded-lg h-96 flex flex-col'>
            {/* Chat Header */}
            <div className='p-4 border-b border-border'>
              <div className='flex items-center gap-3'>
                <div className='h-8 w-8 bg-muted animate-pulse rounded-full' />
                <div className='h-4 w-20 bg-muted animate-pulse rounded-md' />
              </div>
            </div>
            
            {/* Messages Area */}
            <div className='flex-1 p-4 space-y-3'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className='space-y-2'>
                  <div className='h-4 w-48 bg-muted animate-pulse rounded-md' />
                  <div className='h-3 w-16 bg-muted animate-pulse rounded-md' />
                </div>
              ))}
            </div>
            
            {/* Message Input */}
            <div className='p-4 border-t border-border'>
              <div className='h-10 w-full bg-muted animate-pulse rounded-md' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
