import { useModalActions, useToastActions, useFilterActions } from '../../state/ui';
import { dispatchAppEvent, APP_EVENTS } from '../../state/events';

export function DemoControls() {
  const { openModal, closeModal, toggleModal } = useModalActions();
  const { pushToast, clearToasts } = useToastActions();
  const { setFilter, resetFilters, clearFilter } = useFilterActions();

  const handleOpenModal = () => {
    openModal('demo-modal');
  };

  const handleCloseModal = () => {
    closeModal('demo-modal');
  };

  const handleToggleModal = () => {
    toggleModal('demo-modal');
  };

  const handleSuccessToast = () => {
    pushToast({
      title: 'Success!',
      description: 'This is a success message',
      type: 'success',
    });
  };

  const handleErrorToast = () => {
    pushToast({
      title: 'Error!',
      description: 'This is an error message',
      type: 'error',
    });
  };

  const handleInfoToast = () => {
    pushToast({
      title: 'Info',
      description: 'This is an info message',
      type: 'info',
    });
  };

  const handleWarningToast = () => {
    pushToast({
      title: 'Warning!',
      description: 'This is a warning message',
      type: 'warn',
    });
  };

  const handleClearToasts = () => {
    clearToasts();
  };

  const handleSetFilter = () => {
    setFilter('demo-filter', 'demo-value');
  };

  const handleClearFilter = () => {
    clearFilter('demo-filter');
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const handleDispatchEvent = () => {
    dispatchAppEvent(APP_EVENTS.TAG_ADDED, { tagId: 'demo-tag-123' });
  };

  return (
    <div className='space-y-4 p-6 bg-surface border border-border rounded-lg'>
      <h2 className='text-lg font-semibold'>Demo Controls</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Modal Controls */}
        <div className='space-y-2'>
          <h3 className='text-sm font-medium text-muted-foreground'>Modal Controls</h3>
          <div className='flex gap-2 flex-wrap'>
            <button
              onClick={handleOpenModal}
              className='px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
            >
              Open Modal
            </button>
            <button
              onClick={handleCloseModal}
              className='px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2'
            >
              Close Modal
            </button>
            <button
              onClick={handleToggleModal}
              className='px-3 py-1 text-sm bg-muted text-muted-foreground rounded hover:bg-muted/90 focus:outline-none focus:ring-2 focus:ring-muted focus:ring-offset-2'
            >
              Toggle Modal
            </button>
          </div>
        </div>

        {/* Toast Controls */}
        <div className='space-y-2'>
          <h3 className='text-sm font-medium text-muted-foreground'>Toast Controls</h3>
          <div className='flex gap-2 flex-wrap'>
            <button
              onClick={handleSuccessToast}
              className='px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
            >
              Success Toast
            </button>
            <button
              onClick={handleErrorToast}
              className='px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
            >
              Error Toast
            </button>
            <button
              onClick={handleInfoToast}
              className='px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              Info Toast
            </button>
            <button
              onClick={handleWarningToast}
              className='px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2'
            >
              Warning Toast
            </button>
            <button
              onClick={handleClearToasts}
              className='px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
            >
              Clear Toasts
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className='space-y-2'>
          <h3 className='text-sm font-medium text-muted-foreground'>Filter Controls</h3>
          <div className='flex gap-2 flex-wrap'>
            <button
              onClick={handleSetFilter}
              className='px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
            >
              Set Filter
            </button>
            <button
              onClick={handleClearFilter}
              className='px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
            >
              Clear Filter
            </button>
            <button
              onClick={handleResetFilters}
              className='px-3 py-1 text-sm bg-pink-600 text-white rounded hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2'
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Event Controls */}
        <div className='space-y-2'>
          <h3 className='text-sm font-medium text-muted-foreground'>Event Controls</h3>
          <div className='flex gap-2 flex-wrap'>
            <button
              onClick={handleDispatchEvent}
              className='px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            >
              Dispatch Event
            </button>
          </div>
        </div>
      </div>

      <div className='text-xs text-muted-foreground'>
        <p>Check the browser console for event logs and React Query DevTools.</p>
        <p>
          Try: <code>window.dispatchEvent(new CustomEvent('tag:added'))</code>
        </p>
      </div>
    </div>
  );
}
