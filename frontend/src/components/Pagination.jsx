import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange, hasNext, hasPrev }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex pagination logic for many pages
      if (currentPage <= 3) {
        // Near the beginning
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // In the middle
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-6 mt-8">
      {/* Mobile pagination */}
      <div className="flex justify-between flex-1 sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </button>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Page</span>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg font-medium">
            {currentPage}
          </div>
          <span className="text-sm text-gray-600">of {totalPages}</span>
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {/* Desktop pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {/* Page info */}
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-700">
            Showing page <span className="font-semibold text-blue-600">{currentPage}</span> of{' '}
            <span className="font-semibold text-blue-600">{totalPages}</span>
          </p>
          <div className="hidden lg:block w-px h-4 bg-gray-300"></div>
          <div className="hidden lg:flex items-center space-x-1 text-xs text-gray-500">
            <span>Navigate with</span>
            <kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">←</kbd>
            <kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">→</kbd>
          </div>
        </div>

        {/* Page numbers */}
        <nav className="relative z-0 inline-flex items-center space-x-1" aria-label="Pagination">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrev}
            className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Previous</span>
          </button>

          {/* Page numbers */}
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <div key={`ellipsis-${index}`} className="relative inline-flex items-center px-3 py-2">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
              );
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  page === currentPage
                    ? 'z-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform -translate-y-0.5'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                {page}
              </button>
            );
          })}

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNext}
            className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Next</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;