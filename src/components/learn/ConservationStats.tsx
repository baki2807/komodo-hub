'use client'

import { motion } from 'framer-motion'

export const ConservationStats = () => {
  const stats = [
    {
      figure: "17%",
      label: "of the world's species are found in Indonesia",
      color: "bg-blue-500"
    },
    {
      figure: "3,700+",
      label: "Komodo dragons remaining in the wild",
      color: "bg-green-500"
    },
    {
      figure: "54",
      label: "National Parks established in Indonesia",
      color: "bg-yellow-500"
    },
    {
      figure: "20M",
      label: "hectares of Marine Protected Areas",
      color: "bg-red-500"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
          className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className={`${stat.color} w-12 h-1 mb-4 rounded-full`}></div>
          <h3 className="text-3xl font-bold mb-2">{stat.figure}</h3>
          <p className="text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  )
} 