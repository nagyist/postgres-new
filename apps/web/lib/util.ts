import { CreateMessage, generateId, Message } from 'ai'
import { ChangeEvent } from 'react'

/**
 * Programmatically download a `File` from a given URL.
 */
export function downloadFileFromUrl(url: string, filename: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

/**
 * Programmatically download a `File`.
 */
export function downloadFile(file: File) {
  const url = URL.createObjectURL(file)
  downloadFileFromUrl(url, file.name)
}

export async function requestFileUpload() {
  return new Promise<File>((resolve, reject) => {
    // Create a temporary file input element
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.className = 'hidden'

    // Add an event listener to handle the file selection
    fileInput.addEventListener('change', async (event) => {
      const changeEvent = event as unknown as ChangeEvent<HTMLInputElement>
      const [file] = Array.from(changeEvent.target?.files ?? [])
      fileInput.remove()

      if (file) {
        resolve(file)
      } else {
        reject(new Error('No file selected'))
      }
    })

    // Add the file input to the body (required for some browsers)
    document.body.appendChild(fileInput)

    // Trigger the click event on the file input element
    fileInput.click()
  })
}

/**
 * Ensures that a `Message` has an `id` by generating one if it
 * doesn't exist.
 */
export function ensureMessageId(message: Message | CreateMessage): asserts message is Message {
  if (!('id' in message)) {
    message.id = generateId()
  }
}

/**
 * Ensures that all tool invocations have a result before submitting,
 * otherwise the LLM provider will return an error.
 */
export function ensureToolResult(messages: Message[]) {
  let modified = false

  for (const message of messages) {
    if (!message.toolInvocations) {
      continue
    }

    for (const toolInvocation of message.toolInvocations) {
      if (!('result' in toolInvocation)) {
        Object.assign(toolInvocation, {
          result: {
            success: false,
            error: 'Failed to complete',
          },
        })
        modified = true
      }
    }
  }

  return modified
}

/**
 * Checks if the message is a user message sent by the
 * application instead of the user.
 *
 * _(eg. renaming database at start of conversation)_
 */
export function isAutomatedUserMessage(message: Message) {
  return (
    message.role === 'user' &&
    typeof message.data === 'object' &&
    message.data !== null &&
    'automated' in message.data &&
    message.data.automated === true
  )
}

/**
 * Converts a string from `Title Case` to `kebab-case`.
 */
export function titleToKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[_\s]+/g, '-') // Replace spaces and underscores with dashes
    .replace(/[^a-z0-9-]/g, '') // Remove any non-alphanumeric characters except dashes
    .replace(/-+/g, '-') // Replace multiple dashes with a single dash
    .replace(/^-|-$/g, '') // Remove leading and trailing dashes
}

/**
 * Strips a suffix from a string.
 */
export function stripSuffix(value: string, suffix: string): string {
  return value.endsWith(suffix) ? value.slice(0, -suffix.length) : value
}

export function getDeployUrl(params: { databaseId: string; integrationId: number }) {
  const deployParams = new URLSearchParams({
    integration: params.integrationId.toString(),
  })
  return `/deploy/${params.databaseId}?${deployParams.toString()}`
}

export function getOauthUrl(params: { databaseId: string }) {
  const oauthParams = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_SUPABASE_OAUTH_CLIENT_ID!,
    redirect_uri: `${window.location.origin}/api/oauth/supabase/callback`,
    response_type: 'code',
    state: JSON.stringify({
      databaseId: params.databaseId,
    }),
  })
  return `${process.env.NEXT_PUBLIC_SUPABASE_PLATFORM_API_URL}/v1/oauth/authorize?${oauthParams.toString()}`
}
