import { ref } from "vue"

export function useReportManagement(onStoryReportDeleted, onCommentReportDeleted, onStoryReportResolved, onCommentReportResolved) {
  const deleteReport = async (reportId, reportType) => {
    if (confirm(`Are you sure you want to delete this ${reportType} report?`)) {
      try {
        const response = await fetch(`http://localhost:8000/api/moderator/reports/${reportId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          }
        })
  
        if (!response.ok) {
          const errorData = await response.json()
          alert(`Failed to delete report: ${errorData.message || response.statusText}`)
          return
        }
  
        if (reportType === 'story' && onStoryReportDeleted) {
        onStoryReportDeleted(reportId)
        } else if (reportType === 'comment' && onCommentReportDeleted) {
          onCommentReportDeleted(reportId)
        }
      } catch (error) {
        alert(`An error ocurred while deleting the report: ${error.message}`)
      }
    }
  }

  const resolveReport = async (reportId, reportType) => {
    try {
      const response = await fetch(`http://localhost:8000/api/moderator/reports/${reportId}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ status: 'resolved' }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(`Failed to resolve report: ${errorData.message || response.statusText}`)
        return
      }

      alert('Report marked as resolved')
      if (reportType === 'story' && onStoryReportResolved) {
        onStoryReportResolved(reportId)
      } else if (reportType === 'comment' && onCommentReportResolved) {
        onCommentReportResolved(reportId)
      }
    } catch (err) {
      alert(`An error ocurred while resolving the report: ${err.message}`)
    }
  }
  return { deleteReport, resolveReport }
}