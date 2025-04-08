#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import process from 'node:process'
import crypto from 'node:crypto'

const dirname = import.meta.dirname
const projectDir = path.join(dirname, '../')
const distDir = path.join(projectDir, 'dist')
const nodeModulesDir = path.join(projectDir, 'node_modules')
const checksumFile = path.join(distDir, '.checksum')

process.chdir(projectDir)

function calculateChecksum() {
  function getFiles(dir) {
    let files = []

    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (fullPath === distDir || fullPath === nodeModulesDir) {
        continue
      }

      if (entry.isDirectory()) {
        files = files.concat(getFiles(fullPath))
      } else {
        files.push(fullPath)
      }
    }

    return files
  }

  try {
    const files = getFiles(projectDir).sort()

    const hash = crypto.createHash('sha256')

    for (const file of files) {
      const content = fs.readFileSync(file)
      hash.update(`${file}:${content}`)
    }

    return hash.digest('hex')
  } catch (error) {
    console.error('Error calculating checksum:', error)
    // Return empty string to force a rebuild
    return ''
  }
}

function run(nodeTask) {
  console.log(`Running task ${nodeTask}...`)
  execSync(`yarn ${nodeTask}`, {
    stdio: 'inherit',
  })
}

let previousChecksum = ''
if (fs.existsSync(checksumFile)) {
  previousChecksum = fs.readFileSync(checksumFile).toString()
}
const currentChecksum = calculateChecksum()

if (previousChecksum !== currentChecksum) {
  run('install')
  run('dev:build')
  run('admin:build')
  run('docs:build')
  fs.writeFileSync(checksumFile, currentChecksum)
} else {
  console.log('No changes detected, skipping build.')
}