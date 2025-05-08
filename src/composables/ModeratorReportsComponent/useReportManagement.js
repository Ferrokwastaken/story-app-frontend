import { ref } from "vue"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import Swal from "sweetalert2";

export function useReportManagement(onStoryReportDeleted, onCommentReportDeleted, onStoryReportResolved, onCommentReportResolved) {
  const deleteReport = async (reportId, reportType) => {
    const result = await Swal.fire({
      title: 'Delete report',
      text: `Are you sure you want to delete this ${reportType} report?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete the report',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
    })
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_BASE_URL}/moderator/reports/${reportId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          }
        })
  
        if (!response.ok) {
          const errorData = await response.json()
          Swal.fire('Error', `Failed to delete report: ${errorData.message || response.statusText}`, 'error')
          return
        }
  
        if (reportType === 'story' && onStoryReportDeleted) {
        onStoryReportDeleted(reportId)
        } else if (reportType === 'comment' && onCommentReportDeleted) {
          onCommentReportDeleted(reportId)
        }

        Swal.fire('Deleted!', `The ${reportType} report has been deleted.`, 'success')
      } catch (error) {
        Swal.fire('Error!', `An error ocurred while deleting the report: ${error.message}`, 'error')
      }
    }
  }

  const resolveReport = async (reportId, reportType) => {
    const result = await Swal.fire({
      title: 'Resolve report',
      text: `Are you sure you want to 'mark as resolved' this ${reportType}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yeah, get it out of my sight',
      cancelButtonText: 'Cancel',
    })
    if (result.isConfirmed) {
    try {
      const response = await fetch(`${API_BASE_URL}/moderator/reports/${reportId}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ status: 'resolved' }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        Swal.fire('Error', `Failed to resolve report: ${errorData.message || response.statusText}`, 'error')
        return
      }

      if (reportType === 'story' && onStoryReportResolved) {
        onStoryReportResolved(reportId)
      } else if (reportType === 'comment' && onCommentReportResolved) {
        onCommentReportResolved(reportId)
      }
      Swal.fire('Resolved!', `The ${reportType} report has been marked as resolved.`, 'success');
    } catch (err) {
      Swal.fire('Error', `An error ocurred while resolving the report: ${err.message}`, 'error')
    }
  }
  }
  return { deleteReport, resolveReport }
}