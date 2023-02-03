import { getRequests, deleteRequest, saveCompletion, getPlumbers, getCompletions } from "./dataAccess.js"

export const Requests = () => {
    const requests = getRequests()
    const plumbers = getPlumbers()
    const completions = getCompletions()

    return `
        <table>
            <tr>
                <th>Request</th>
                <th>Completed By</th>
                <th></th>
            </tr>
        
    ${requests
    .sort((incompleteReq, completeReq) => {
        const Completions = completions.find(completion => parseInt(completion.requestId) === completeReq.id)
        const Incompletions = completions.find(completion => parseInt(completion.requestId) !== incompleteReq.id)
        if (Completions && !Incompletions) {
            return 1
        } else if (Incompletions && !Completions) {
            return -1
        }
        })
    .map(request => {
        return `
            <tr>
                <td>${request.description}</td>
                
        ${completions
        .find(completion => parseInt(completion.requestId) === request.id)
        ?
            (function() {
                const foundCompletion = completions.find(completion => parseInt(completion.requestId) === request.id)
                const foundPlumber = plumbers.find(plumber => parseInt(foundCompletion.plumberId) === plumber.id)
                return `
                <td class="completedRequest">${foundPlumber.name}</td>`
            }) ()
        :
                `<td class="imcompleteRequest">
                    <select id="plumbers">
                        <option value="">Choose</option>
                        ${plumbers.map(plumber => {
                            return `<option value="${request.id}--${plumber.id}">${plumber.name}</option>`
                        })}
                    </select>
                </td>`
        }
                <td>
                    <button class="request__delete" id="request--${request.id}">Delete</button>
                </td>
            </tr>`
    })
    .join("")}
            </table>`
    }

const mainContainer = document.querySelector("#container")

mainContainer.addEventListener("click", click => {
    if (click.target.id.startsWith("request--")) {
        const [,requestId] = click.target.id.split("--")
        deleteRequest(parseInt(requestId))
    }
})

mainContainer.addEventListener(
    "change",
    (event) => {
        if (event.target.id === "plumbers") {
            const [requestId, plumberId] = event.target.value.split("--")

            /*
                This object should have 3 properties
                   1. requestId
                   2. plumberId
                   3. date_created
            */
            const completion = {
                requestId: requestId,
                plumberId: plumberId,
                date_created: new Date()
             }

            /*
                Invoke the function that performs the POST request
                to the `completions` resource for your API. Send the
                completion object as a parameter.
             */
            saveCompletion(completion)

        }
    }
)