export default function HomePage() {
  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-foreground mb-4'>Welcome to Tags!</h1>
        <p className='text-lg text-muted-foreground'>Connect with people who share your interests</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='bg-surface border border-border rounded-lg p-6'>
          <h3 className='text-lg font-semibold mb-2'>Discover</h3>
          <p className='text-muted-foreground'>Find new people and interests</p>
        </div>

        <div className='bg-surface border border-border rounded-lg p-6'>
          <h3 className='text-lg font-semibold mb-2'>Matches</h3>
          <p className='text-muted-foreground'>See your compatibility scores</p>
        </div>

        <div className='bg-surface border border-border rounded-lg p-6'>
          <h3 className='text-lg font-semibold mb-2'>Chat</h3>
          <p className='text-muted-foreground'>Connect with your matches</p>
        </div>
      </div>
    </div>
  );
}
