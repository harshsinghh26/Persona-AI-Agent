"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Code, TrendingUp, BookOpen, Star, Users, Award } from "lucide-react"
import { personaDefinitions, type Persona } from "./persona-definitions"
import { Card } from "./ui/card"

interface PersonaSwitcherProps {
  currentPersona: Persona
  onPersonaChange: (persona: Persona) => void
  isLoading?: boolean
}

export function PersonaSwitcher({ currentPersona, onPersonaChange, isLoading = false }: PersonaSwitcherProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-0 shadow-2xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Chat with Your Favorite Tech Gurus 
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Switch between industry experts and get personalized advice in their unique teaching styles
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {Object.entries(personaDefinitions).map(([key, persona]) => {
          const isActive = currentPersona === key
          return (
            <Button
              key={key}
              variant="ghost"
              onClick={() => onPersonaChange(key as Persona)}
              disabled={isLoading}
              className={`h-auto p-0 transition-all duration-500 hover:scale-[1.02] group ${
                isActive ? "ring-2 ring-indigo-400 ring-offset-2" : ""
              }`}
            >
              <Card
                className={`w-full p-6 transition-all duration-500 ${
                  isActive
                    ? "bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 text-white shadow-2xl"
                    : "bg-white dark:bg-slate-800 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 dark:hover:from-slate-700 dark:hover:to-slate-800 shadow-lg hover:shadow-xl"
                }`}
              >
                {/* Header with Avatar and Status */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <Avatar
                      className={`w-16 h-16 border-3 shadow-lg ${
                        isActive ? "border-white/30" : "border-indigo-200 dark:border-slate-600"
                      }`}
                    >
                      <AvatarFallback className={`text-xl font-bold ${persona.color} text-white`}>
                        {persona.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {isActive && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold">{persona.fullName}</h3>
                      {isActive && <Star className="w-5 h-5 text-yellow-300 animate-pulse" />}
                    </div>
                    <p className={`text-sm mb-2 ${isActive ? "text-white/90" : "text-gray-600 dark:text-gray-400"}`}>
                      {persona.teachingStyle}
                    </p>
                    <Badge
                      className={`text-xs ${
                        isActive
                          ? "bg-white/20 text-white border-white/30"
                          : "bg-indigo-100 text-indigo-700 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {key === "hitesh" ? (
                        <>
                          <Code className="w-3 h-3 mr-1" /> Full-Stack Expert
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-3 h-3 mr-1" /> Business & Tech
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                <p
                  className={`text-sm leading-relaxed mb-4 ${
                    isActive ? "text-white/90" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {persona.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {persona.expertise.slice(0, 4).map((skill, index) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className={`text-xs px-2 py-1 transition-all duration-300 ${
                        isActive
                          ? "bg-white/10 text-white border-white/30 hover:bg-white/20"
                          : "bg-gray-100 text-gray-700 border-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 hover:bg-indigo-100 hover:text-indigo-700"
                      }`}
                    >
                      {skill}
                    </Badge>
                  ))}
                  {persona.expertise.length > 4 && (
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-1 ${
                        isActive
                          ? "bg-white/10 text-white/70 border-white/20"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      +{persona.expertise.length - 4}
                    </Badge>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${isActive ? "bg-green-300 animate-pulse" : "bg-gray-400"}`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        isActive ? "text-white/80" : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {isActive ? "Active Now" : "Available"}
                    </span>
                  </div>
                  {isActive && (
                    <Badge className="bg-yellow-400 text-yellow-900 text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      Selected
                    </Badge>
                  )}
                </div>
              </Card>
            </Button>
          )
        })}
      </div>

      <Card className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 border border-emerald-200 dark:border-slate-600">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-700 dark:text-emerald-300">Current Session Focus</h4>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              {personaDefinitions[currentPersona].fullName}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-12">
          {personaDefinitions[currentPersona].personality.focus}
        </p>
      </Card>
    </Card>
  )
}
